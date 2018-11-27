const moment = require('moment')
const { Op } = require('sequelize')
const { User, Appointment } = require('../models')

class DashboardController {
  async index (req, res) {
    const providers = await User.findAll({ where: { provider: true } })
    return res.render('dashboard', { providers })
  }

  async show (req, res) {
    const { id } = req.session.user

    const clients = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('day')
              .format()
          ]
        }
      }
    })

    return res.render('appointments', { clients })
  }
}

module.exports = new DashboardController()
