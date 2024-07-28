const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const accountManager = require('../utils/accountManager'); // เปลี่ยน path ให้ถูกต้อง

const data = {
    name: 'shop',
    description: 'Buy Item here.',
};

/**
 * @param {Object} param0 
 * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
    const shopmenu = [{
        label: 'Role',
        description: 'Role Test',
        value: 'menu',
        price: 100 // ราคาไอเท็ม
    }];

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(interaction.id)
        .setPlaceholder('โปรดเลือกยศที่จะซื้อที่นี่. . .')
        .setMinValues(0)
        .setMaxValues(shopmenu.length)
        .addOptions(
            shopmenu.map((shop) =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(shop.label)
                    .setDescription(shop.description)
                    .setValue(shop.value)
            )
        );

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
        content: 'เลือกยศที่จะซื้อ:',
        components: [actionRow],
    });

    // Listener for the select menu
    const filter = (i) => i.customId === interaction.id && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (i) => {
        if (i.isStringSelectMenu()) {
            const selectedValue = i.values[0];
            const selectedItem = shopmenu.find(item => item.value === selectedValue);
            const price = selectedItem.price;

            try {
                const balance = await accountManager.getBalance(i.user.id);

                if (balance < price) {
                    await i.update({ content: 'ยอดเงินในบัญชีของคุณไม่เพียงพอที่จะซื้อยศนี้', components: [] });
                    return;
                }

                await accountManager.deductBalance(i.user.id, price);

                let roleId;
                if (selectedValue === 'menu') {
                    roleId = '1262676002950348862'; // Replace with the actual role ID you want to assign
                }

                if (roleId) {
                    const member = i.member;
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (role) {
                        await member.roles.add(role);
                        await i.update({ content: 'คุณได้ซื้อยศนี้เรียบร้อยแล้ว', components: [] });
                    } else {
                        await i.update({ content: 'ไม่พบยศที่ต้องการ', components: [] });
                    }
                }
            } catch (error) {
                console.error(error);
                await i.update({ content: 'เกิดข้อผิดพลาดในการซื้อยศ', components: [] });
            }
        }
    });
}

module.exports = { data, run };
