import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { UserException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';

export default new Command(
  new SlashCommandBuilder().setName('add-event-participant').setDescription('Ajoute l\'utilisateur à l\'événement donné.')
    .addUserOption((option) => option.setName("user").setDescription("L'utilisateur à ajouter à l'événement."))
    .addStringOption((option) => option.setName('event-name').setDescription("Le nom de l'événement"))
    .addStringOption((option) => option.setName('parent-event-name').setDescription("Le nom de l'événement parent")),
  async (interaction) => {
    const user = interaction.options.getUser("user");
    const eventName = interaction.options.getString("event-name");
    const parentEvent = interaction.options.getString("parent-event-name");

    if(user == null) {
      throw new UserException("Le user à ajouter est obligatoire.");
    }
    if(eventName == null) {
      throw new UserException("Le nom de l'événement est obligatoire.");
    }

    await eventService.addEventParticipant(eventName, parentEvent, [ user.id ], interaction.user.id);
    if(parentEvent == null) {
      await interaction.reply({ content: `L'utilisateur ${user.username} a bien été ajouté à l'événement ${eventName}.` });
    } else {
      await interaction.reply({ content: `L'utilisateur ${user.username} a bien été ajouté au programme ${eventName} de l'événement ${parentEvent}.` });
    }
  }
);