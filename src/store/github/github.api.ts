import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ReposResponse, Response} from "../../models/models";

export const githubApi = createApi({
    reducerPath: 'github/api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.github.com/'
    }),
    refetchOnFocus: true,
    endpoints: build => ({
        searchUsers: build.query<Response.IUser[], string>({
            query: (search: string) => ({
                url: 'search/users',
                params: {
                    q: search,
                    per_page: 10,
                },
            }),
            transformResponse: (response: Response.IResponse) => response.items,
        }),
        getUserRepos: build.query<ReposResponse.IRepo[], string>({
            query: (username) => ({
                url: `users/${username}/repos`,
            })
        })
    }),
});

export const { useSearchUsersQuery, useLazyGetUserReposQuery } = githubApi;