import React, {ChangeEvent, useEffect, useState} from 'react';
import {useLazyGetUserReposQuery, useSearchUsersQuery} from "../store/github/github.api";
import {useDebounce} from "../hooks/useDebounce";
import RepoCard from "../components/RepoCard";

const HomePage = () => {
    const [search, setSearch] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    const debounced = useDebounce(search);
    const [fetchRepos, { isLoading: areReposLoading, data: repos }] = useLazyGetUserReposQuery();
    const {data, isLoading, isError} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true,
    });

    useEffect(() => {
        setShowDropDown(debounced.length > 3 && data?.length! > 0)
    }, [debounced, data]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }
    const clickHandler = (userName: string) => {
        fetchRepos(userName);
        setShowDropDown(false);
    };

    return (
        <div className="flex justify-center pt-10 mx-auto h-screen w-screen">
            { isError && <p className="text-center text-red-600">Something went wrong...</p> }

            <div className="relative w-[560px]">
                <input
                    type="text"
                    className="border py-2 px-4 w-full h-[42px] mb-2"
                    value={search}
                    onChange={handleChange}
                    placeholder="Search for GitHub users"
                />

                {showDropDown && <ul className="absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white">
                    {isLoading && <p className="text-center">Loading...</p>}

                    {data?.map(user => {
                        return <li
                            key={user.id}
                            onClick={() => clickHandler(user.login)}
                            className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                            {user.login}
                        </li>
                    })}
                </ul>}

                <div className="container">
                    {areReposLoading && <p className="text-center">Repos are loading...</p> }

                    { repos?.map(repo => <RepoCard key={repo.id} repo={repo} />)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;