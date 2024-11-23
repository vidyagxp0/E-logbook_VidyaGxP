const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const UserRole = require("../models/userRoles");

function checkAdminJwtToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized User",
    });
  }
  jwt.verify(token, config.development.JWT_ADMIN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
      });
    }
    req.user = decoded;
    next();
  });
}

function checkUserJwtToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized User",
    });
  }

  jwt.verify(token, config.development.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
      });
    }
    req.user = decoded;
    next();
  });
}

function authorizeUserRole(processId, roleId) {
  return async (req, res, next) => {
    const userRoles = await UserRole.findAll({
      where: {
        user_id: req.user.userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!req.body.site_id) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide a site ID." });
    }

    if (hasAccess(userRoles, Number(req.body?.site_id), processId, roleId)) {
      next(); // User has access, proceed to the next middleware or route handler
    } else {
      res
        .status(403)
        .json({ message: "Forbidden: You do not have required permissions." });
    }
  };
}

function hasAccess(userRoles, site_id, processId, roleId) {
  return userRoles.some(
    (role) =>
      (role.role_id === 5 && // Grant access if role_id is 5 (full permissions)
        role.site_id === site_id &&
        role.process_id === processId) ||
      (role.site_id === site_id &&
        role.process_id === processId &&
        role.role_id === roleId)
  );
}

const getFileUrl = (file) => {
  if (file?.filename) {
    return `https://elog-backend.mydemosoftware.com//profile_pics/${file?.filename}`;
  }
};

const getElogDocsUrl = (file) => {
  if (file?.filename) {
    return `https://elog-backend.mydemosoftware.com//elog_docs/${file?.filename}`;
  }
};

module.exports.getFileUrl = getFileUrl;
module.exports.getElogDocsUrl = getElogDocsUrl;
module.exports.checkUserJwtToken = checkUserJwtToken;
module.exports.checkAdminJwtToken = checkAdminJwtToken;
module.exports.authorizeUserRole = authorizeUserRole;
