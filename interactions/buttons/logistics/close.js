const { Material, Group } = require('../../../data/models.js');

module.exports = {
	id: 'button_logistics_close',

	async execute(interaction) {
		const threadId = interaction.customId.split('-')[2];

		await Group.findOne({ threadId: `${threadId}` }).exec()
			.then(async group => {
				const thread = interaction.guild.channels.cache.get(`${threadId}`);

				if (!thread) {
					return interaction.reply({
						content: 'This thread does not exist !',
						ephemeral: true,
					});
				}

				await Material.deleteMany({ group_id: `${threadId}` });

				await thread.delete(true);
				await group.deleteOne({ threadId: `${threadId}` });
			}).catch(err => {
				console.error(err);
				return interaction.reply({
					content: 'An error occured while closing the thread.',
					ephemeral: true,
				});
			});

	},
};
