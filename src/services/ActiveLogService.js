const actionLogModel = require('../models/ActiveLogModel')
const log = async ({ action_type, entity_type, entity_id, action_by }) => {
    try {
        await actionLogModel.create({
            action_type,
            entity_id,
            entity_type,
            action_by
        })
        console.log('Logged ', action_by)
    } catch (error) {
        console.log(error?.message)
    }

}
module.exports = {
    log
}