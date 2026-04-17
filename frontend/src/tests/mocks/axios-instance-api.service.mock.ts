type ApiResponse<T = unknown> = {
  data: {
    success: boolean;
    data: T;
    error?: { message: string; code?: number };
  };
};

const ok = <T>(data: T): Promise<ApiResponse<T>> =>
  Promise.resolve({
    data: {
      success: true,
      data,
    },
  });

const ko = (message: string): Promise<never> =>
  Promise.reject({
    response: {
      data: {
        error: {
          message,
        },
      },
    },
    message,
  });

const mockGet = jest.fn((url: string) => {
  if (url === "/api/auth/me") {
    return ok({ user: { id: "usr-1", email: "test@example.com", role: "ORGANIZER" } });
  }

  if (url === "/api/analytics") {
    return ok([]);
  }

  return ok({ data: [], hasMore: false } as any);
});

const mockPost = jest.fn((url: string, payload?: any) => {
  if (url === "/api/auth/login") {
    if (payload?.email === "wrong@example.com") {
      return ko("Identifiants incorrects");
    }

    return ok({
      user: {
        id: "usr-1",
        email: payload?.email ?? "test@example.com",
        role: "ORGANIZER",
      },
      token: "header.payload.signature",
    });
  }

  if (url === "/api/auth/register") {
    return ok({
      id: "usr-1",
      email: payload?.email ?? "new@example.com",
      role: payload?.role ?? "ORGANIZER",
    });
  }

  if (url === "/api/auth/logout") {
    return ok({ message: "Logged out" });
  }

  return ok(null);
});

const mockPut = jest.fn(() => ok(null));
const mockDelete = jest.fn(() => ok(null));

export const axiosWithAuthApi = {
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
};

export const axiosWithoutAuthApi = {
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
};
