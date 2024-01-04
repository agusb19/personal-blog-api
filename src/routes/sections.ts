import multer from 'multer'
import { Router } from "express"
import { Sections as SectionController } from "../controllers/Sections"
import { type ISection } from "../types/sections"
import { type IStyle } from "../types/styles"

type ModelsType = {
    styleModel: IStyle
    sectionModel: ISection
}

const createSectionRouter = ({ styleModel, sectionModel }: ModelsType) => {
    const sectionRouter = Router()

    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage })

    const sectionController = new SectionController({ styleModel, sectionModel })

    sectionRouter.get('/', sectionController.getAll)
    sectionRouter.put('/', upload.single('image'), sectionController.changeAll)
    sectionRouter.post('/', upload.single('image'), sectionController.addNew)
    sectionRouter.delete('/', sectionController.remove)

    return sectionRouter
}

export default createSectionRouter