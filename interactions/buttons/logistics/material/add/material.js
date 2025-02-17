const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Material } = require('../../../../../data/models.js');
const Translate = require('../../../../../utils/translations.js');

module.exports = {
	id: 'button_logistics_add_material',

	async execute(interaction) {
		const { client, guild, message } = interaction;
		const translations = new Translate(client, guild.id);

		const buttonSmallArms = new ButtonBuilder()
			.setCustomId('logistics_select_material_small_arms')
			.setLabel(translations.translate('MATERIAL_SMALL_ARMS'))
			.setStyle(ButtonStyle.Primary);

		const buttonHeavyArms = new ButtonBuilder()
			.setCustomId('logistics_select_material_heavy_arms')
			.setLabel(translations.translate('MATERIAL_HEAVY_ARMS'))
			.setStyle(ButtonStyle.Primary);

		const buttonUtilities = new ButtonBuilder()
			.setCustomId('logistics_select_material_utilities')
			.setLabel(translations.translate('MATERIAL_UTILITIES'))
			.setStyle(ButtonStyle.Primary);

		const buttonShipables = new ButtonBuilder()
			.setCustomId('logistics_select_material_shipables')
			.setLabel(translations.translate('MATERIAL_SHIPABLES'))
			.setStyle(ButtonStyle.Primary);

		const buttonVehicles = new ButtonBuilder()
			.setCustomId('logistics_select_material_vehicles')
			.setLabel(translations.translate('MATERIAL_VEHICLES'))
			.setStyle(ButtonStyle.Primary);

		const buttonUniforms = new ButtonBuilder()
			.setCustomId('logistics_select_material_uniforms')
			.setLabel(translations.translate('MATERIAL_UNIFORMS'))
			.setStyle(ButtonStyle.Primary);

		const buttonBack = new ButtonBuilder()
			.setCustomId('logistics_select_material_back')
			.setLabel(translations.translate('BACK'))
			.setStyle(ButtonStyle.Secondary);

		const firstArrowRow = new ActionRowBuilder().addComponents(buttonSmallArms, buttonUtilities, buttonHeavyArms);
		const secondArrowRow = new ActionRowBuilder().addComponents(buttonShipables, buttonVehicles, buttonUniforms);
		const thirdArrowRow = new ActionRowBuilder().addComponents(buttonBack);

		try {
			const material = await Material.findOne({ material_id: `${message.id}` });

			if (interaction.user.id !== material.owner_id) {
				return await interaction.reply({
					content: translations.translate('MATERIAL_ARE_NO_CREATOR_ERROR'),
					ephemeral: true,
				});
			}

			await interaction.update({
				content: `${translations.translate('MATERIAL_SELECT_TYPE')}`,
				components: [firstArrowRow, secondArrowRow, thirdArrowRow],
			});
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: translations.translate('MATERIAL_CREATE_ERROR'),
				ephemeral: true,
			});
		}
	},
};
