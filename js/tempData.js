export default tempData = [];

export function updateTodos(index, cards) {
  // Clear tempData
  tempData.length = 0;
  // Create a new card for each name and add it to tempData
  cards.forEach((card) => {
    tempData.push({
      id: card.id,
      name: card.name,
      color: card.color,
      todos: card.todos,
      completed: card.state,
      idChecklist: card.idChecklist,
    });
  });
}
