export function hasAccess(roleId, site_id = null, processId = null) {
  const userRoles = JSON.parse(localStorage.getItem("user-details")).roles;

  return userRoles.some((role) => {
    const siteMatch = site_id === null || role.site_id === site_id;
    const processMatch = processId === null || role.process_id === processId;

    return (
      (role.role_id === 5 && siteMatch && processMatch) || // Full permissions role
      (siteMatch && processMatch && role.role_id === roleId)
    );
  });
}
