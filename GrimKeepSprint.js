/// <reference path="lib/scripts.d.ts" />
var script = registerScript({
    name: "GrimKeepSprint",
    version: "1.0",
    authors: ["Helper"]
});

script.registerModule({
    name: "GrimKeepSprint",
    category: "Movement",
    description: "Maintains momentum after hits"
}, function (module) {
    module.on("update", function () {
        if (mc.thePlayer.hurtTime > 0) {
            // Во время удара не даем серверу резко остановить нас
            mc.thePlayer.speedInAir = 0.022; // Чуть выше стандартного 0.02
            if (mc.thePlayer.onGround) {
                mc.thePlayer.motionX *= 1.02;
                mc.thePlayer.motionZ *= 1.02;
            }
        }
    });
});
