/// <reference path="lib/scripts.d.ts" />

var script = registerScript({
    name: "GrimBypassFixed",
    version: "2.0",
    authors: ["Helper"]
});

script.registerModule({
    name: "GrimUniversal",
    category: "Movement",
    description: "Bypass for Grim (Velocity + Ice)"
}, function (module) {

    module.on("packet", function (event) {
        var packet = event.getPacket();
        
        // Универсальный способ проверки пакета отдачи без прямого пути net.minecraft...
        // Проверяем через простое имя класса
        var packetName = packet.getClass().getSimpleName();
        
        if (packetName.indexOf("EntityVelocity") !== -1 || packetName.indexOf("S2CPacketEntityVelocity") !== -1) {
            // Если это пакет отдачи
            try {
                // Проверяем, наш ли это ID
                if (packet.getEntityId() == mc.thePlayer.getEntityId()) {
                    // Снижаем отдачу через прямое изменение полей (может потребоваться рефлексия)
                    packet.motionX *= 0.7;
                    packet.motionZ *= 0.7;
                }
            } catch (e) {
                // Если методы называются иначе (например, в 1.20)
                // Просто игнорируем ошибку, чтобы не спамить в консоль
            }
        }
    });

    module.on("update", function () {
        // Логика льда
        if (mc.thePlayer.onGround && (mc.thePlayer.input.movementForward != 0 || mc.thePlayer.input.movementInterests != 0)) {
            // Используем множитель, который Grim обычно не замечает
            mc.thePlayer.addVelocity(
                mc.thePlayer.motionX * 0.01, 
                0, 
                mc.thePlayer.motionZ * 0.01
            );
        }
    });
});
