const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Material } = require('../../../../../data/models.js');
const Translate = require('../../../../../utils/translations.js');

module.exports = {
	id: 'button_logistics_add_quantity_ask',

	async execute(interaction) {
		const { client, guild, message } = interaction;
		const translations = new Translate(client, guild.id);

		try {
			const material = await Material.findOne({ material_id: `${message.id}` });

			if (interaction.user.id !== material.owner_id) {
				return await interaction.reply({
					content: translations.translate('MATERIAL_ARE_NO_CREATOR_ERROR'),
					ephemeral: true,
				});
			}

			const modal = new ModalBuilder()
				.setCustomId('modal_logistics_add_quantity_ask')
				.setTitle(translations.translate('MATERIAL_SELECT_QUANTITY'));

			const quantityAskField = new TextInputBuilder()
				.setCustomId('quantity_ask')
				.setLabel(translations.translate('MATERIAL_SELECT_QUANTITY'))
				.setStyle(TextInputStyle.Short)
				.setValue(`${material.quantityAsk}`)
				.setMinLength(1)
				.setMaxLength(5)
				.setRequired(true);

			const actionRow = new ActionRowBuilder().addComponents(quantityAskField);

			modal.addComponents(actionRow);

			await interaction.showModal(modal);
		}
		catch (error) {
			console.error(error);
			return await interaction.reply({
				content: translations.translate('MATERIAL_SELECT_QUANTITY_ERROR'),
				ephemeral: true,
			});
		}
	},
};
