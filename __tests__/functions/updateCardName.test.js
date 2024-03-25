// updateCardName.test.js

import { updateCardName } from "../../functions.min.js"; // Adjust the path accordingly
import { API_KEY, API_TOKEN } from "@env";
import axios from "axios";

jest.mock("axios"); // Mock axios for testing

describe("updateCardName", () => {
  it("updates the card name", async () => {
    const mockCardId = "65dde4bebbb2fdd4d60ed9c8"; // Replace with an actual card ID
    const mockNewName = "New Card Name";

    // Mock the axios response
    axios.put.mockResolvedValue({ data: { name: mockNewName } });

    // Call the function
    const updatedCard = await updateCardName(mockCardId, mockNewName);

    // Assertions
    expect(axios.put).toHaveBeenCalledWith(
      `https://api.trello.com/1/cards/${mockCardId}?name=${mockNewName}&key=${API_KEY}&token=${API_TOKEN}`
    );
    expect(updatedCard.name).toBe(mockNewName);
  });

  it("throws an error if update fails", async () => {
    const mockCardId = "65dde4bebbb2fdd4d60ed9c8";
    const mockNewName = "New Card Name";

    // Mock an error response
    axios.put.mockRejectedValue(new Error("Update failed"));

    // Call the function and expect an error
    await expect(updateCardName(mockCardId, mockNewName)).rejects.toThrowError(
      "Update failed" // Update the expected error message
    );
  });
});
