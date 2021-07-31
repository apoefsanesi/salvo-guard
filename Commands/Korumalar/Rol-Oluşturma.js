const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');
const Config = require("../../Configuration/Settings.json");
const Salvo_Config = require("../../Configuration/Config.json");

exports.run = async (client, message, args) => {
  
let salvoembed = new Discord.MessageEmbed().setColor(Config.Embed.Color).setFooter(Config.Embed.Footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
if (message.author.id !== Salvo_Config.Bot.Owner) return message.channel.send(salvoembed.setDescription(`Bu Komutu Sadece <@!${Salvo_Config.Bot.Owner}> Kullanabilir.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
let rolkoruma = await message.channel.send(salvoembed.setDescription(`**__Rol Koruma - Oluşturma Engel;__**

Bu işlemi kabul ederseniz whitelistte olan kullanıcılar haricinde 
rol oluşturan herkes engellenecektir.

✅ : \`Aktif Et\`, ❎ : \`Pasif Bırak\`, 🗑️ : \`İptal Et\`
`))
rolkoruma.react("✅").then(() => rolkoruma.react("❎")).then(() => rolkoruma.react("🗑️"));
const filter = (reaction, user) => {
return(
    ["✅","❎","🗑️"].includes(reaction.emoji.name) &&
    user.id === message.author.id
);
}
rolkoruma.awaitReactions(filter, {max: 1, time: 120000, errors: ["time"]})
.then((collected) => {
const reaction = collected.first();
if (reaction.emoji.name === "✅") {
    rolkoruma.edit(salvoembed.setColor("RANDOM").setDescription(`Rol Koruma - Oluşturma Engel Başarılı Bir Şekilde Aktif Edildi.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
    rolkoruma.reactions.removeAll().catch(error => console.error("Bir Hata Oluştu: : ", error));
    message.react(Config.Emojis.Check);
    aktifEt();
} else if (reaction.emoji.name === "❎") {
    rolkoruma.edit(salvoembed.setColor("RANDOM").setDescription(`Rol Koruma - Oluşturma Engel Başarılı Bir Şekilde Pasif Bırakıldı.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
    rolkoruma.reactions.removeAll().catch(error => console.error("Bir Hata Oluştu: : ", error));
    message.react(Config.Emojis.Check);
    pasifEt();
} else if (reaction.emoji.name === "🗑️") {
    rolkoruma.edit(salvoembed.setColor("RANDOM").setDescription(`İşleminiz İptal Edildi.`)).then(m => m.create({timeout: Config.Embed.Timeout}));
    rolkoruma.reactions.removeAll().catch(error => console.error("Bir Hata Oluştu: : ", error));
    message.react(Config.Emojis.create);
} 
})

const aktifEt = async () => {
    db.set(`${message.guild.id}_rolkoruma_create`, "aktif")
};

const pasifEt = async () => {
    db.create(`${message.guild.id}_rolkoruma_create`)
};

};
exports.conf = {
  aliases: ['rol-koruma-create'],
  permLevel: 0
};

exports.help = {
  name: 'rol-koruma-create',
  description: 'Salvatore was here',
  usage: 'rol-koruma-create'
};