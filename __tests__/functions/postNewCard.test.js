// postNewCard.test.js

import { postNewCard } from "../../functions.min.js"; // Adjust the path accordingly
import axios from "axios";

jest.mock("axios"); // Mock axios for testing

describe("postNewCard", () => {
  it("creates a new card and checklist", async () => {
    const mockIdList = "65dde4387d51532d0a48698b"; // Replace with an actual list ID
    const mockName = "New Card";
    const mockDesc = "Sample card description"; // Adjust as needed

    // Mock the axios responses
    const mockCardResponse = { data: { id: "mockCardId" } };
    const mockChecklistResponse = { data: { id: "mockChecklistId" } };
    axios.post
      .mockResolvedValueOnce(mockCardResponse)
      .mockResolvedValueOnce(mockChecklistResponse);

    // Call the function
    const result = await postNewCard(mockIdList, mockName, mockDesc);

    // Assertions
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining(
        `idList=${mockIdList}&name=${mockName}&desc=${encodeURIComponent(
          mockDesc
        )}`
      )
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining(`idCard=mockCardId&name=Checklist`)
    );
    expect(result.card.id).toBe("mockCardId");
    expect(result.checklist.id).toBe("mockChecklistId");
  });

  it("throws an error if card creation fails", async () => {
    const mockIdList = "65dde4387d51532d0a48698b";
    const mockName = "New Card";
    const mockDesc = "Sample card description";

    // Mock an error response
    axios.post.mockRejectedValue(new Error("Card creation failed"));

    // Call the function and expect an error
    await expect(
      postNewCard(mockIdList, mockName, mockDesc)
    ).rejects.toThrowError(
      "Card creation failed" // Update the expected error message
    );
  });
});
