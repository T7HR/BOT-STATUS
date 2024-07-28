const { EmbedBuilder } = require('discord.js');
const accountManager = require('../utils/accountManager'); // ตรวจสอบให้แน่ใจว่า path ถูกต้อง

const data = {
    name: 'เช็คยอดเงิน',
    description: 'ตรวจสอบยอดเงินในบัญชีของคุณ',
};

/**
 * @param {Object} param0 
 * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
    const userId = interaction.user.id;

    try {
        const balance = await accountManager.getBalance(userId);

        // สร้าง Embed สีเขียว
        const embed = new EmbedBuilder()
            .setColor('#00ff00') // สีเขียว
            .setTitle('ยอดเงินในบัญชีของคุณ')
            .setDescription(`ยอดเงิน: ${balance} บาท`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        await interaction.reply('เกิดข้อผิดพลาดในการตรวจสอบยอดเงินในบัญชีของคุณ');
    }
}

module.exports = { data, run };
