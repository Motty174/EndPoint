const bcrypt =require('bcrypt')
module.exports={
    PORT: process.env.PORT || 8080,
    Password_Salt: bcrypt.genSaltSync(10),
    MongoURI: 'mongodb+srv://Onik:123456Onik@cluster0.gfpf5.mongodb.net/hooks',
    secret_access: 'sjak@o42M@$@!MNJ2$K25638y&dui89(@*e!515"DAIjfc@(@!5',
    secret_refresh: 'kj@&*$((JHh28912261J2356f36%5r123#%@#"sfa6fsa59w3qQUJRRNjnfa*(#@!6596562',
    cookieSecret: "DE$PERA7O_!_B1TC%_!_1f_U_r3aD1n6_Th15_g0_t0_H3*L_F.@()@.fma@Kfakm5fas5",
    email: 'hooks.info.0@gmail.com',
    email_password: '25032000Onik'
}