const { Operation, Group, Material } = require('../../../data/models.js');
const Translate = require('../../../utils/translations.js');

module.exports = {
	id: 'button_create_operation_cancel',

	async execute(interaction) {
		const operationId = interaction.message.id;
		const translations = new Translate(interaction.client, interaction.guild.id);

		try {
			const operation = await Operation.findOne({ operation_id: `${operationId}` });

			if (interaction.user.id !== operation.owner_id) {
				return await interaction.reply({
					content: translations.translate('OPERATION_ARE_NO_OWNER_ERROR'),
					ephemeral: true,
				});
			}

			const threads = await Group.find({ operation_id: `${operationId}` });
			for (const thread of threads) {
				const result = interaction.channel.threads.cache.find(t => t.id === thread.threadId);

				if (result) {
					await Material.deleteMany({ group_id: `${thread.threadId}` });
					await interaction.channel.messages.fetch(result.id).then(msg => msg.delete());
					await result.delete();
					await thread.deleteOne({ threadId: `${result.id}` });
				}
			}

			await Operation.deleteOne({ operation_id: `${operationId}` });

			await interaction.message.delete();

			await interaction.reply({
				content: translations.translate('OPERATION_CANCELED_SUCCESS', { title: operation.title }),
				ephemeral: true,
			});
		}
		catch (err) {
			console.error(err);
			return await interaction.reply({
				content: translations.translate('OPERATION_CANCELED_ERROR'),
				ephemeral: true,
			});
		}
	},
};
