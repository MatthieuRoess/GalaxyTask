// updateCardList.test.js

import { updateCardList } from "../../functions.min.js"; // Adjust the path accordingly
import { API_KEY, API_TOKEN } from "@env";
import axios from "axios";

jest.mock("axios"); // Mock axios for testing

describe("updateCardList", () => {
  it("updates the card list", async () => {
    const mockCardId = "65e6e25f1e1e5d80ded41b74"; // Replace with an actual card ID
    const mockNewListId = "65dde381e9b53260acd8ea02"; // Replace with an actual list ID

    // Mock the axios response
    axios.put.mockResolvedValue({ data: { idList: mockNewListId } });

    // Call the function
    const updatedCard = await updateCardList(mockCardId, mockNewListId);

    // Assertions
    expect(axios.put).toHaveBeenCalledWith(
      `https://api.trello.com/1/cards/${mockCardId}?idList=${mockNewListId}&key=${API_KEY}&token=${API_TOKEN}`
    );
    expect(updatedCard.idList).toBe(mockNewListId);
  });

  it("throws an error if update fails", async () => {
    const mockCardId = "65e6e25f1e1e5d80ded41b74";
    const mockNewListId = "65dde381e9b53260acd8ea02";

    // Mock an error response
    axios.put.mockRejectedValue(new Error("Update failed"));

    // Call the function and expect an error
    await expect(
      updateCardList(mockCardId, mockNewListId)
    ).rejects.toThrowError(
      "Update failed" // Update the expected error message
    );
  });
});
