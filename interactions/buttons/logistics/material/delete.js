const { Material } = require('../../../../data/models.js');
const Translate = require('../../../../utils/translations.js');

module.exports = {
	id: 'button_logistics_material_delete',

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

			const rowCount = await Material.deleteOne({ material_id: `${message.id}` });

			if (rowCount.deletedCount === 0) {
				return await interaction.reply({
					content: translations.translate('MATERIAL_NOT_EXIST'),
					ephemeral: true,
				});
			}

			await interaction.message.delete();

			await interaction.reply({
				content: translations.translate('MATERIAL_DELETE_SUCCESS'),
				ephemeral: true,
			});
		}
		catch (err) {
			console.error(err);
			return await interaction.reply({
				content: translations.translate('MATERIAL_DELETE_ERROR'),
				ephemeral: true,
			});
		}
	},
};
