export const mockGenerateContent = jest.fn().mockResolvedValue({
  response: {
    text: () => 'Mock AI response'
  }
});

export const mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContent: mockGenerateContent
});

export const MockGoogleGenerativeAI = jest.fn().mockImplementation(() => ({
  getGenerativeModel: mockGetGenerativeModel
})); 