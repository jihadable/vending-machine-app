import { v4 as uuid } from "uuid"

export const getIdentifier = () => {
    return uuid()
}