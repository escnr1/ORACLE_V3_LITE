let user = async (m, { args, command, text, conn }) => {
    
    try {
        const groupMetadata = await conn.groupMetadata(m.chat);
        let participant = groupMetadata.participants.find(
            p => p.id === m.sender || 
                 p.id.split('@')[0] === m.sender ||
                 p.phoneNumber === m.sender
        );

        if (!participant) {
            return m.reply(`الرقم ${targetNumber} لازم يبقي الجروب`);
        }

        const user = {
            name: m.name || "Owner",
            jid: participant.phoneNumber,
            lid: participant.id
        };
        
        m.reply(JSON.stringify(user, null, 2));

    } catch (err) {
        m.reply(err.message);
    }
};

user.command = ['لمطور','id'];
export default user;