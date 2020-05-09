import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.TOKEN;
const PLAYING_ROLE_ID = process.env.PLAYING_ROLE_ID;

const client = new Discord.Client();

const hasPlayingRole = (member: Discord.GuildMember): boolean => {
  for (const role of member.roles.cache.array()) {
    if (role.id === PLAYING_ROLE_ID) {
      return true;
    }
  }

  return false;
};

const setOrRemovePlayingRoleForMember = (
  member: Discord.GuildMember,
  playing: boolean
) => {
  if (playing) {
    // set playing role if not already set

    if (hasPlayingRole(member)) {
      return;
    }

    member.roles.add(PLAYING_ROLE_ID);
  } else {
    // remove playing role if set

    if (!hasPlayingRole(member)) {
      return;
    }

    member.roles.remove(PLAYING_ROLE_ID);
  }
};

const refreshRolesForGuild = (guild: Discord.Guild) => {
  guild.members.cache.array().forEach((member) => {
    for (const activity of member.presence.activities) {
      if (activity.name === "Elite Dangerous") {
        // set the playing role
        setOrRemovePlayingRoleForMember(member, true);
        return;
      }
    }

    // remove the playing role
    setOrRemovePlayingRoleForMember(member, false);
  });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  client.guilds.cache.array().forEach((guild) => {
    console.log(`Refreshing roles for guild "${guild.name}".`);
    refreshRolesForGuild(guild);
  });
});

client.on("presenceUpdate", (_, newPresence) => {
  for (const activity of newPresence.activities) {
    if (activity.name === "Elite Dangerous") {
      console.log(`${newPresence.user.tag} is playing Elite: Dangerous!`);
      setOrRemovePlayingRoleForMember(newPresence.member, true);
      return;
    }
  }

  // not playing ED
  console.log(`${newPresence.user.tag} is NOT playing Elite: Dangerous.`);
  setOrRemovePlayingRoleForMember(newPresence.member, false);
});

client.login(TOKEN);
