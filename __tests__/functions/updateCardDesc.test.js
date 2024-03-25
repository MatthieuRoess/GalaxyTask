// updateCardDesc.test.js

import { updateCardDesc } from "../../functions.min.js"; // Adjust the path accordingly
import { API_KEY, API_TOKEN } from "@env";
import axios from "axios";

jest.mock("axios"); // Mock axios for testing

describe("updateCardDesc", () => {
  it("updates the card description", async () => {
    const mockCardId = "65e6e25f1e1e5d80ded41b74";
    const mockNewDesc = "New Card Description";
    const encodedDesc = encodeURIComponent(mockNewDesc); // Encode the description

    // Mock the axios response
    axios.put.mockResolvedValue({ data: { desc: mockNewDesc } });

    // Call the function
    const updatedCard = await updateCardDesc(mockCardId, mockNewDesc);

    // Assertions
    expect(axios.put).toHaveBeenCalledWith(
      `https://api.trello.com/1/cards/${mockCardId}?desc=${encodedDesc}&key=${API_KEY}&token=${API_TOKEN}`
    );
    expect(updatedCard.desc).toBe(mockNewDesc);
  });

  it("throws an error if update fails", async () => {
    const mockCardId = "65e6e25f1e1e5d80ded41b74";
    const mockNewDesc = "New Card Description";

    // Mock an error response
    axios.put.mockRejectedValue(new Error("Update failed"));

    // Call the function and expect an error
    await expect(updateCardDesc(mockCardId, mockNewDesc)).rejects.toThrowError(
      "Update failed" // Update the expected error message
    );
  });
});
