var res = {
	spineboy_atlas: "res/spine/spineboy.atlas",
    spineboy_json: "res/spine/spineboy.json",
    spineboy_png: "res/spine/spineboy.png",
    raptor_atlas: "res/spine/raptor.atlas",
    raptor_json: "res/spine/raptor.json",
    raptor_png: "res/spine/raptor.png",
    goblins_atlas: "res/spine/goblins.atlas",
    goblins_json: "res/spine/goblins.json",
    goblins_png: "res/spine/goblins.png",
    animationbuttonnormal_png: "res/animationbuttonnormal.png",
    town_gif: "rpg/res/town.gif",
    town_tmx: "rpg/res/town.tmx",
    stars_png: "res/stars.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
