/// <reference path="lib/scripts.d.ts" />

var script = registerScript({
    name: "GrimPower",
    version: "3.0",
    authors: ["Helper"]
});

script.registerModule({
    name: "GrimIceAndVel",
    category: "Movement",
    description: "Ice Friction + Velocity Bypass"
}, function (module) {

    module.on("update", function () {
        // --- LOGIC: ICESIM ---
        // Проверяем движение (совместимо с новыми версиями через .input)
        var input = mc.thePlayer.input || mc.thePlayer.movementInput;
        var isMoving = input.moveForward != 0 || input.moveStrafe != 0;

        if (mc.thePlayer.onGround && isMoving) {
            // Имитируем скольжение льда. 
            // Используем метод motion, который обычно открыт для записи
            mc.thePlayer.motionX *= 1.01;
            mc.thePlayer.motionZ *= 1.01;
        }
    });

    module.on("packet", function (event) {
        var packet = event.getPacket();
        
        // --- LOGIC: VELOCITY ---
        // Вместо обращения к net.minecraft (которое запрещено), 
        // проверяем наличие полей, которые есть только в пакете Velocity
        if (packet.getPacketId && packet.getPacketId() == 0x12) { // 0x12 - ID пакета EntityVelocity в 1.16+
             processVel(packet);
        } else if (packet.getClass().getSimpleName().indexOf("Velocity") !== -1) {
             processVel(packet);
        }
    });

    function processVel(packet) {
        try {
            // Проверяем, наш ли это ID (защита от лагов других игроков)
            if (packet.getEntityId() == mc.thePlayer.getEntityId()) {
                // Вместо 0 (который даст Failed Transaction), ставим 40%
                packet.motionX = packet.getMotionX() * 0.5;
                packet.motionZ = packet.getMotionZ() * 0.5;
                // Вертикальную (Y) не трогаем — это критично для Grim!
            }
        } catch (e) {
            // Если методы называются иначе, пробуем через поля
            try {
                packet.field_149415_b *= 0.5; // motionX для 1.8.9
                packet.field_149413_d *= 0.5; // motionZ для 1.8.9
            } catch (err) {}
        }
    }
});
