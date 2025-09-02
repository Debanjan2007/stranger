import jwt from 'jsonwebtoken';
export const verifyJwt = (req , res , next) => {
    try {
        const { session } = req.cookies;
        const payload = jwt.verify(session , process.env.JWT_REFRESH_SECRET);
        if(!payload){
            return res.redirect('/?error=unauthorized')
        }
        req.user = payload ;
        next();
    } catch (error) {
        console.log(`error in jwt verification : ${error} `);
        return res.redirect('/?error=unauthorized');
    }
}