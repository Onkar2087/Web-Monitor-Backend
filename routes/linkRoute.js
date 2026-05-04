import express from "express"
import { addLinkController, checkLinkController, deleteLinkController, getAllLinksController, getStatusController, linkController } from "../controllers/linkController.js"

const linkRouter = express.Router()

linkRouter.post('/fetch', linkController);
linkRouter.post('/add', addLinkController)
linkRouter.delete('/delete/:id', deleteLinkController)
linkRouter.post('/check/:id', checkLinkController)
linkRouter.get('/status/:id', getStatusController)
linkRouter.get('/links', getAllLinksController)

export default linkRouter