// closeCard.test.js

import { closeCard } from "../../functions.min.js"; // Adjust the path accordingly
import { API_KEY, API_TOKEN } from "@env";
import axios from "axios";

jest.mock("axios"); // Mock axios for testing

describe("closeCard", () => {
  it("closes the card", async () => {
    const mockCardId = "65dde381e9b53260acd8ea02"; // Replace with an actual card ID

    // Mock the axios response
    axios.put.mockResolvedValue({ data: { closed: true } });

    // Call the function
    const closedCard = await closeCard(mockCardId);

    // Assertions
    expect(axios.put).toHaveBeenCalledWith(
      `https://api.trello.com/1/cards/${mockCardId}?closed=true&key=${API_KEY}&token=${API_TOKEN}`
    );
    expect(closedCard.closed).toBe(true);
  });

  it("throws an error if closing fails", async () => {
    const mockCardId = "65dde381e9b53260acd8ea02";

    // Mock an error response
    axios.put.mockRejectedValue(new Error("Closing failed"));

    // Call the function and expect an error
    await expect(closeCard(mockCardId)).rejects.toThrowError(
      "Closing failed" // Update the expected error message
    );
  });
});
