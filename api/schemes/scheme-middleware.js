
const schemeModel = require("./scheme-model");


const checkSchemeId = async (req, res, next) => {
  try {
    let isExist = await schemeModel.findById(req.params.scheme_id);
    if (!isExist) {
      res.status(404).json({ message: `scheme_id ${req.params.scheme_id} id li şema bulunamadı` })
    } else {
      req.existScheme = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
}

const validateScheme = (req, res, next) => {
  try {
    let { scheme_name } = req.body;
    if (!scheme_name || typeof scheme_name !== "string") {
      res.status(400).json({message: "Geçersiz scheme_name"})
    } else {
      next();
    }
  } catch (error) {

  }
}

const validateStep = (req, res, next) => {
  try {
    let {instructions, step_number} = req.body;
    if (!instructions || step_number == undefined || typeof step_number !== "number" || step_number < 1) {
      res.status(400).json({message: "Hatalı step"});
    } else {
      next()
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};