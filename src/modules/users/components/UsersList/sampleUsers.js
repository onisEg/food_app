const members = [
  ["Nora Salem", "Spain"], ["Omar Farid", "Egypt"], ["Leila Martin", "France"],
  ["Adam Cole", "Ireland"], ["Maya Haddad", "Jordan"], ["Sara Costa", "Spain"],
  ["Amir Nasser", "Egypt"], ["Lina Silva", "Portugal"], ["Noah Rossi", "Italy"],
  ["Emma Reed", "Ireland"], ["Ziad Mansour", "Jordan"], ["Ava Torres", "Spain"],
];

export const sampleUsers = members.map(([userName, country], index) => ({
  id: index + 1, userName, country,
  email: userName.toLowerCase().replace(" ", ".") + "@example.org",
  group: index % 5 === 0 ? { id: 1, name: "SuperAdmin" } : { id: 2, name: "SystemUser" },
  creationDate: new Date(Date.UTC(2026, 10, 15 - index)).toISOString(),
}));
