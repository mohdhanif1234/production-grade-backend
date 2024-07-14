import express from 'express';
import "dotenv/config"
import ApiRoutes from './routes/api.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/api', ApiRoutes);

const port = process.env.PORT || 8000

app.get('/', (req, res) => {
    return res.json({ message: 'Hello its working' })
})

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})
