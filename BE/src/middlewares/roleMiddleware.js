// Sử dụng như: roleMiddleware('admin'), roleMiddleware('doctor'), roleMiddleware(['admin', 'doctor'])
const roleMiddleware = (roles) => {
  // roles: string hoặc mảng
  return (req, res, next) => {
    const { userInfo } = req;
    if (!userInfo) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const allowRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowRoles.includes(userInfo.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập chức năng này!' });
    }
    next();
  };
};

module.exports = roleMiddleware;
