import jwt from 'jsonwebtoken';
export const unAuthorisedHandler = (req , res , next) => {
    try {
        const { session } = req.cookies;
        if(!session){
            return res.redirect('/?error=unauthorized');
        }
        const sessionChecked = jwt.verify(session , process.env.JWT_REFRESH_SECRET);
        if(!sessionChecked){
            return res.redirect('/?error=unauthorized');
        }
        next();
    } catch (error) {
        console.log(`error in unathorised : ${error} `);        
        return res.redirect('/?error=unauthorized');
    }
}