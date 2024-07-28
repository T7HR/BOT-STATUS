const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, PermissionsBitField } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('ลบข้อความตามจำนวน')
    .setDescription('ลบข้อความตามจำนวนที่กำหนด')
    .addIntegerOption(option =>
        option.setName('amount')
            .setDescription('จำนวนข้อความที่ต้องการลบ')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
    );

/**
 * @param {Object} param0 
 * @param {CommandInteraction} param0.interaction
 */
async function run({ interaction }) {
    const amount = interaction.options.getInteger('amount');

    // ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการจัดการข้อความ
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return await interaction.reply({ content: 'คุณไม่มีสิทธิ์ในการลบข้อความ', ephemeral: true });
    }

    try {
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `ลบข้อความจำนวน ${amount} ข้อความเรียบร้อยแล้ว`, ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'เกิดข้อผิดพลาดในการลบข้อความ', ephemeral: true });
    }
}

module.exports = { data, run };
