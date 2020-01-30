/**
 * Created by George on 2016/12/1.
 */
var circleNum = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳"];
var container, stats;
var camera, controls, scene, renderer;
var objects = [];
var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    intersection = new THREE.Vector3(),
    INTERSECTED, SELECTED;
var geometry = new THREE.BoxGeometry(40, 40, 40);
var isHammer = false, isBrush = false, isRolling = false;

var rotationGroup = new THREE.Object3D();
var model = null;
init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;

    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();

    // var axes = new THREE.AxisHelper(200);
    // scene.add(axes);

    scene.add(new THREE.AmbientLight(0x505050));

    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    light.castShadow = true;

    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 200, 10000));
    light.shadow.bias = -0.00022;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    scene.add(light);


    //控制器
    var ctrlGeometry = new THREE.CylinderGeometry(0, 10, 20);//圆锥
    var objectX = new THREE.Mesh(ctrlGeometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
    objectX.position.x = 200;
    objectX.rotation.z = -Math.PI / 2;
    objectX.uuid = "objectX";
    var objectX_N = new THREE.Mesh(ctrlGeometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
    objectX_N.position.x = -200;
    objectX_N.rotation.z = Math.PI / 2;
    objectX_N.uuid = "objectX_N";
    var objectY = new THREE.Mesh(ctrlGeometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));
    objectY.position.y = 200;
    objectY.uuid = "objectY";
    var objectY_N = new THREE.Mesh(ctrlGeometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));
    objectY_N.position.y = -200;
    objectY_N.rotation.z = Math.PI;
    objectY_N.uuid = "objectY_N";
    var objectZ = new THREE.Mesh(ctrlGeometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    objectZ.position.z = 200;
    objectZ.rotation.x = Math.PI / 2;
    objectZ.uuid = "objectZ";
    var objectZ_N = new THREE.Mesh(ctrlGeometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    objectZ_N.position.z = -200;
    objectZ_N.rotation.x = -Math.PI / 2;
    objectZ_N.uuid = "objectZ_N";

    scene.add(objectX);
    scene.add(objectY);
    scene.add(objectZ);
    scene.add(objectX_N);
    scene.add(objectY_N);
    scene.add(objectZ_N);
    objects.push(objectX);
    objects.push(objectY);
    objects.push(objectZ);
    objects.push(objectX_N);
    objects.push(objectY_N);
    objects.push(objectZ_N);

    /*    for (var z = 0; z < 4; z++) {

     for (var y = 0; y < 5; y++) {

     for (var x = 0; x < 3; x++) {

     var object = new THREE.Mesh(geometry, sixFace());
     object.position.x = (x - 1) * 40 + x;
     object.position.y = (y - 2) * 40 + y;
     object.position.z = (z - 1.5) * 40 + z;

     scene.add(object);

     objects.push(object);
     }
     }
     }*/

    initCube();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    window.addEventListener('resize', onWindowResize, false);

}

function initCube() {
    model = model1_1;
    var xi = model.line.x % 2 ? 0 : 0.5;
    var yi = model.line.y % 2 ? 0 : 0.5;
    var zi = model.line.z % 2 ? 0 : 0.5;
    for (var z = 0; z < model.line.z; z++) {

        for (var y = 0; y < model.line.y; y++) {

            for (var x = 0; x < model.line.x; x++) {

                var object = new THREE.Mesh(geometry, this.texture_cube(model.face.yz[y][z], model.face.xz[x][z], model.face.xy[x][y]));
                object.position.x = (x - Math.floor(model.line.x / 2) + xi) * 40 + x;
                object.position.y = (y - Math.floor(model.line.y / 2) + yi) * 40 + y;
                object.position.z = (z - Math.floor(model.line.z / 2) + zi) * 40 + z;
                //object.scale.set(1.2,1.2,1.2);
                object.uuid = x + "_" + y + "_" + z;
                scene.add(object);
                objects.push(object);
            }
        }
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (SELECTED) {
        if (raycaster.ray.intersectPlane(plane, intersection)) {
            //SELECTED.position.copy(intersection.sub(offset));//控制移动
            var v = intersection.sub(offset);
            if (SELECTED.uuid === "objectX") {
                if (v.x > -200 && v.x < 200)SELECTED.position.copy(new THREE.Vector3(v.x, SELECTED.position.y, SELECTED.position.z));//控制移动
                hiddenCube("x", v.x - 100);
            }
            else if (SELECTED.uuid === "objectX_N") {
                if (v.x > -200 && v.x < 200)SELECTED.position.copy(new THREE.Vector3(v.x, SELECTED.position.y, SELECTED.position.z));//控制移动
                hiddenCube("x_N", v.x + 100);
            }
            else if (SELECTED.uuid === "objectY") {
                if (v.y > -200 && v.y < 200)SELECTED.position.copy(new THREE.Vector3(SELECTED.position.x, v.y, SELECTED.position.z));//控制移动
                hiddenCube("y", v.y - 100);
            }
            else if (SELECTED.uuid === "objectY_N") {
                if (v.y > -200 && v.y < 200)SELECTED.position.copy(new THREE.Vector3(SELECTED.position.x, v.y, SELECTED.position.z));//控制移动
                hiddenCube("y_N", v.y + 100);
            }
            else if (SELECTED.uuid === "objectZ") {
                if (v.z > -200 && v.z < 200)SELECTED.position.copy(new THREE.Vector3(SELECTED.position.x, SELECTED.position.y, v.z));//控制移动
                hiddenCube("z", v.z - 100);
            }
            else if (SELECTED.uuid === "objectZ_N") {
                if (v.z > -200 && v.z < 200)SELECTED.position.copy(new THREE.Vector3(SELECTED.position.x, SELECTED.position.y, v.z));//控制移动
                hiddenCube("z_N", v.z + 100);
            }
        }

        return;

    }

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            //if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            if (INTERSECTED.material.constructor != THREE.MultiMaterial)
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

            plane.setFromNormalAndCoplanarPoint(
                camera.getWorldDirection(plane.normal),
                INTERSECTED.position);

        }

        container.style.cursor = 'pointer';

    } else {

        //if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

        container.style.cursor = 'auto';

    }

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        controls.enabled = false;

        SELECTED = getVisibilityCube(intersects);
        //SELECTED = intersects[0].object;
        // console.log(SELECTED);
        // console.log(camera);
        if (raycaster.ray.intersectPlane(plane, intersection)) {

            offset.copy(intersection).sub(SELECTED.position);

        }
    }

}

function onDocumentMouseUp(event) {

    event.preventDefault();

    controls.enabled = true;

    if (INTERSECTED) {
        if (INTERSECTED.material.constructor != THREE.MultiMaterial) {//单一材质
            if (isHammer && INTERSECTED.uuid.indexOf("object") === -1) {
                if (INTERSECTED.material.color.getStyle() == 'rgb(85,85,85)')
                    return;
                scene.remove(INTERSECTED);
                objects.remove(INTERSECTED);
                // console.log(objects);
            }
            if (isBrush && INTERSECTED.uuid.indexOf("object") === -1) {
                if (INTERSECTED.material.color.getStyle() == 'rgb(85,85,85)')
                    INTERSECTED.material.color.setStyle('#ffffff');
                else
                    INTERSECTED.material.color.setStyle('#555555');
            }
        }
        else//多重材质
        {
            if (isHammer && INTERSECTED.uuid.indexOf("object") === -1) {
                if (INTERSECTED.material.materials[0].color.getStyle() == 'rgb(85,85,85)' || INTERSECTED.material.materials[0].color.getStyle() == 'rgb(81,81,81)')//85 普通刷漆，81 敲错刷漆
                {
                    SELECTED = null;
                    container.style.cursor = 'auto';
                    return;
                }
                if (model.cube.xyz.contains(INTERSECTED.uuid)) {
                    alert("wrong!!");
                    INTERSECTED.material.materials.forEach(function (e) {
                        e.color.setStyle('#515151')
                    });
                    SELECTED = null;
                    container.style.cursor = 'auto';
                    return;
                }
                scene.remove(INTERSECTED);
                objects.remove(INTERSECTED);
                checkSuccess();
                //console.log(objects);
            }
            if (isBrush && INTERSECTED.uuid.indexOf("object") === -1) {//INTERSECTED.uuid.length > 10
                if (INTERSECTED.material.materials[0].color.getStyle() == 'rgb(85,85,85)')
                    INTERSECTED.material.materials.forEach(function (e) {
                        e.color.setStyle('#ffffff')
                    });
                else
                    INTERSECTED.material.materials.forEach(function (e) {
                        e.color.setStyle('#555555')
                    });
            }
        }
        SELECTED = null;
    }

    container.style.cursor = 'auto';

}

function getVisibilityCube(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].object.visible)
            return list[i].object;
    }
    return list[0].object;
}

function hiddenCube(vec, length) {
    for (var i = 6; i < objects.length; i++) {
        if (vec === "x" && objects[i].position.x > length)
            objects[i].visible = false;
        else if (vec === "x_N" && objects[i].position.x < length)
            objects[i].visible = false;
        else if (vec === "y" && objects[i].position.y > length)
            objects[i].visible = false;
        else if (vec === "y_N" && objects[i].position.y < length)
            objects[i].visible = false;
        else if (vec === "z" && objects[i].position.z > length)
            objects[i].visible = false;
        else if (vec === "z_N" && objects[i].position.z < length)
            objects[i].visible = false;
        else
            objects[i].visible = true;
    }
}

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function hammerTime() {
    isHammer = ~isHammer;
    isBrush = false;
    var tool = document.getElementById("hammer");
    tool.style.backgroundSize = "90% 90%"
    tool.style.backgroundRepeat = "no-repeat"
    tool.style.backgroundPosition = "center"
    console.log("hammerTime~");
}

function brushTime() {
    isBrush = ~isBrush;
    isHammer = false;
    var tool = document.getElementById("brush");
    tool.style.backgroundSize = "90% 90%"
    tool.style.backgroundRepeat = "no-repeat"
    tool.style.backgroundPosition = "center"

    console.log("brushTime~");
}

function release() {
    var tool = document.getElementById("hammer");
    tool.style.backgroundSize = "100% 100%"
    var round = document.getElementById("roundh");
    round.style.display = isHammer ? "block" : "none";
    var tool = document.getElementById("brush");
    tool.style.backgroundSize = "100% 100%"
    var round = document.getElementById("roundb");
    round.style.display = isBrush ? "block" : "none";
}

function sixFace() {


    var mode = [
        this.getMaterial("", "#ffffff", "#5d4a36", 2, 32),
        this.getMaterial(parseInt((Math.random() * 10)).toString(), "#ffffff", "#5d4a36", 2, 32),//常规数字
        this.getMaterial(circleNum[parseInt((Math.random() * 10))], "#ffffff", "#5d4a36", 2, 32),//圆形数字
        this.getMaterial(parseInt((Math.random() * 10 + 1)).toString(), "#ffffff", "#5d4a36", 2, 32, true)//方形数字
        /*         this.getMaterial("1", "#ffffff", "#5d4a36", 2, 32),
         this.getMaterial("2", "#ffffff", "#5d4a36", 2, 32),
         this.getMaterial("3", "#ffffff", "#5d4a36", 2, 32),
         this.getMaterial("4", "#ffffff", "#5d4a36", 2, 32),
         this.getMaterial("5", "#ffffff", "#5d4a36", 2, 32),
         this.getMaterial("6", "#ffffff", "#5d4a36", 2, 32),*/
    ];
    var mats = [];
    for (var i = 0; i < 6; i++) {
        mats.push(mode[parseInt(Math.random() * 4)]);
        //mats.push(mode[i]);
    }
    return new THREE.MeshFaceMaterial(mats);
}

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}

function checkSuccess() {
    if (model.cube.xyz.length === objects.length - 6) {
        isRolling = true;
        //alert("Win");

        for (var i = 0; i < objects.length; i++) {
            if(objects[i].uuid.indexOf("object") !== -1) {
                scene.remove(objects[i]);
                objects.remove(objects[i]);
                i--;
            }
            else
                rotationGroup.add(objects[i]);
        }
        scene.add(rotationGroup);

    }

}

function render() {

    controls.update();
    renderer.render(scene, camera);

    if(isRolling)
        rotationGroup.rotation.y += 0.02;
}
/**
 * 立方体六面材质
 * @param textYZ 1，2面
 * @param textXZ 3，4面
 * @param textXY 5，6面
 * @returns {THREE.MeshFaceMaterial}
 */
function texture_cube(textYZ, textXZ, textXY) {
    var mats = [];
    var yz = texture_face(textYZ);//插入1，2面
    mats.push(yz);
    mats.push(yz);

    var xz = texture_face(textXZ);//插入3，4面
    mats.push(xz);
    mats.push(xz);

    var xy = texture_face(textXY);//插入5，6面
    mats.push(xy);
    mats.push(xy);

    return new THREE.MeshFaceMaterial(mats);

}
/**
 * 生成单面材质
 * @param text 传入的文本
 * @returns {THREE.MeshBasicMaterial} 返回材质
 */
function texture_face(text) {
    try {
        if (text === "")
            return this.getMaterial("", "#ffffff", "#5d4a36", 2, 32);//空白
        var ls = text.split("");
        if (ls.length === 1)
            return this.getMaterial(text, "#ffffff", "#5d4a36", 2, 32);//常规数字
        if (ls[0] === "c")
            return this.getMaterial(circleNum[ls[1]], "#ffffff", "#5d4a36", 2, 32);//圆形数字
        if (ls[0] === "r")
            return this.getMaterial(ls[1], "#ffffff", "#5d4a36", 2, 32, true);//方形数字

        return this.getMaterial("", "#ffffff", "#5d4a36", 2, 32);
    }
    catch (e) {
        return this.getMaterial("", "#ffffff", "#5d4a36", 2, 32);
    }
}
/**
 * 写数字
 * @param text 数字
 * @param background 背景色
 * @param borderColor 边框颜色
 * @param borderWidth 边框宽度
 * @param width canvar 宽度
 * @param rect 是否是方框数字
 * @returns {THREE.MeshBasicMaterial}
 */
function getMaterial(text, background, borderColor, borderWidth, width, isRect) {

    var dynamicTexture = new THREEx.DynamicTexture(width, width);
    dynamicTexture.context.font = "bold " + (0.8 * width) + "px '楷体'";
    dynamicTexture.clearWithBorder(background, borderColor, borderWidth);
    dynamicTexture.drawTextCooked(text, {
        lineHeight: 0.7,
        align: "center",
        fillStyle: "black",
        isRect: isRect,
    });

    var material = new THREE.MeshBasicMaterial({
        map: dynamicTexture.texture
    });
    return material;
}