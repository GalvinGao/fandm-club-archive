import { NetID } from "../components/clubs/model"
import users from "./all.json"

export const findUserMap = (netId: NetID) => {
  const user = users.find(user => user.email === `${netId}@fandm.edu`)
  return user ? user : null
}
