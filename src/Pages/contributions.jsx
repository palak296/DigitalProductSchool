import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../utilities/UserContext";

const Contributions = () => {
    const [contributedRepos, setContributedRepos] = useState([]);
    const [monthlyContributions, setMonthlyContributions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [reposPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://api.github.com/users/${userContext.username}/events?per_page=100`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch contribution activity");
                }

                const data = await response.json();
                const contributedRepos = data.map((event) => ({
                    type: event.type,
                    name: event.repo.name,
                    created_at: event.created_at,
                    details: getEventDetails(event),
                }));

                setContributedRepos(contributedRepos);
                setMonthlyContributions(getMonthlyContributions(contributedRepos));
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userContext.username]);

    const getEventDetails = (event) => {
        switch (event.type) {
            case "PushEvent":
                if (event.payload && event.payload.commits) {
                    const commitCount = event.payload.commits.length;
                    const branch = event.payload.ref.split("/").pop();
                    return `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to the ${branch} branch.`;
                }
                break;
            case "PullRequestEvent":
                if (event.payload && event.payload.action && event.payload.number) {
                    const action = event.payload.action;
                    const pullRequestNumber = event.payload.number;
                    return `${action} pull request #${pullRequestNumber}.`;
                }
                break;
            case "IssueCommentEvent":
                if (event.payload && event.payload.action && event.payload.issue) {
                    const action = event.payload.action;
                    const issueTitle = event.payload.issue.title;
                    return `${action} issue "${issueTitle}".`;
                }
                break;
            case "CreateEvent":
                if (event.payload && event.payload.ref_type && event.payload.ref) {
                    const refType = event.payload.ref_type;
                    const refName = event.payload.ref;
                    return `Created ${refType} "${refName}".`;
                }
                break;
            case "DeleteEvent":
                if (event.payload && event.payload.ref_type && event.payload.ref) {
                    const refType = event.payload.ref_type;
                    const refName = event.payload.ref;
                    return `Deleted ${refType} "${refName}".`;
                }
                break;
            case "ForkEvent":
                if (event.payload && event.payload.forkee) {
                    const forkeeRepoName = event.payload.forkee.full_name;
                    return `Forked repository "${forkeeRepoName}".`;
                }
                break;
            case "GollumEvent":
                if (event.payload && event.payload.pages && event.payload.pages.length > 0) {
                    const pageChangeCount = event.payload.pages.length;
                    return `Made ${pageChangeCount} wiki page ${pageChangeCount > 1 ? "changes" : "change"}.`;
                }
                break;
            case "IssuesEvent":
                if (event.payload && event.payload.action && event.payload.issue) {
                    const action = event.payload.action;
                    const issueTitle = event.payload.issue.title;
                    return `${action} issue "${issueTitle}".`;
                }
                break;
            case "MemberEvent":
                if (event.payload && event.payload.action && event.payload.member) {
                    const action = event.payload.action;
                    const memberUsername = event.payload.member.login;
                    return `${action} member "${memberUsername}".`;
                }
                break;
            case "PublicEvent":
                return "Made the repository public.";
            case "PullRequestReviewEvent":
                if (event.payload && event.payload.action && event.payload.pull_request) {
                    const action = event.payload.action;
                    const pullRequestTitle = event.payload.pull_request.title;
                    return `${action} pull request review "${pullRequestTitle}".`;
                }
                break;
            case "PullRequestReviewCommentEvent":
                if (event.payload && event.payload.action && event.payload.comment) {
                    const action = event.payload.action;
                    const commentBody = event.payload.comment.body;
                    return `${action} pull request review comment "${commentBody}".`;
                }
                break;
            case "PullRequestReviewThreadEvent":
                if (event.payload && event.payload.action && event.payload.comment) {
                    const action = event.payload.action;
                    const commentBody = event.payload.comment.body;
                    return `${action} pull request review thread "${commentBody}".`;
                }
                break;
            case "ReleaseEvent":
                if (event.payload && event.payload.action && event.payload.release) {
                    const action = event.payload.action;
                    const releaseTagName = event.payload.release.tag_name;
                    return `${action} release "${releaseTagName}".`;
                }
                break;
            case "SponsorshipEvent":
                if (event.payload && event.payload.action && event.payload.sponsorship) {
                    const action = event.payload.action;
                    const sponsorUsername = event.payload.sponsorship.sponsor.login;
                    return `${action} sponsorship from "${sponsorUsername}".`;
                }
                break;
            case "WatchEvent":
                return "Starred the repository.";
            default:
                return null;
        }
    };



    const getMonthlyContributions = (contributions) => {
        const monthlyContributions = {};

        contributions.forEach((contribution) => {
            const monthYear = contribution.created_at.substring(0, 7);

            if (monthlyContributions[monthYear]) {
                monthlyContributions[monthYear]++;
            } else {
                monthlyContributions[monthYear] = 1;
            }
        });

        return monthlyContributions;
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastRepo = currentPage * reposPerPage;
    const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
    const currentRepos = contributedRepos.slice(
        indexOfFirstRepo,
        indexOfLastRepo
    );

    return (
        <div className="bg-gray-900 min-h-screen p-8 sm:p-16">
            <div className="max-w-2xl mx-auto rounded-lg bg-gray-800 shadow-lg">
                <h2 className="text-2xl font-bold text-white m-6 pt-5 flex justify-center">
                    Contribution Activity
                </h2>
                <div className="bg-gray-900  p-4 sm:p-7">
                    {isLoading ? (
                        <p className="text-white px-4 py-2 text-center">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 px-4 py-2 text-center">{error}</p>
                    ) : currentRepos.length > 0 ? (
                        <>
                            <ContributionsList contributedRepos={currentRepos} />
                            <MonthlyContributions monthlyContributions={monthlyContributions} />
                        </>
                    ) : (
                        <p className="text-white px-4 py-2 text-center">No contributions found.</p>
                    )}
                </div>
            </div>
            <button
                className="absolute top-0 left-0 mt-2 ml-2 px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                onClick={() => navigate(-1)}
            >
                Back
            </button>
            {!isLoading && !error && (
                <Pagination
                    reposPerPage={reposPerPage}
                    totalRepos={contributedRepos.length}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

const ContributionsList = ({ contributedRepos }) => (
    <div className="mt-4">
        <ul className="mt-2">
            {contributedRepos.map((item, index) => (
                <ContributionsItem key={index} item={item} />
            ))}
        </ul>
    </div>
);


const ContributionsItem = ({ item }) => {
    const createdAt = new Date(item.created_at);
    const formattedDate = createdAt.toLocaleDateString();

    return (
        <li className="py-2 mb-4">
            {item.details && <div className="text-white font-semibold mb-2">{item.details}</div>}

            <a
                href={`https://github.com/${item.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
                {item.name}
            </a>
            <div className="flex items-center mt-2">
                <span className="rounded-full bg-yellow-200 py-1 px-2 text-sm text-gray-900 mr-2">
                    {formattedDate}
                </span>
                <span className="rounded-full bg-red-200 py-1 px-2 text-sm text-gray-900">
                    {item.type}
                </span>
            </div>
        </li>
    );
};


const MonthlyContributions = ({ monthlyContributions }) => (
    <div className="mt-10">
        <h3 className="text-lg rounded-full bg-green-400 inline-block p-3 font-bold text-gray-800 mb-2">
            Monthly Contributions
        </h3>
        {Object.entries(monthlyContributions).map(([monthYear, count]) => (
            <p className="text-white" key={monthYear}>
                {`${monthYear}: ${count} ${count > 1 ? "contributions" : "contribution"}`}
            </p>
        ))}
    </div>
);

const Pagination = ({ reposPerPage, totalRepos, currentPage, onPageChange }) => {
    const pageNumbers = Array.from(
        { length: Math.ceil(totalRepos / reposPerPage) },
        (_, i) => i + 1
    );

    return (
        <div className="flex justify-center mt-4">
            <ul
                className="flex  flex-wrap space-x-2 space-y-1"

            >
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`px-3 py-1 text-center rounded-md ${number === currentPage
                            ? "bg-gray-800 text-white"
                            : "bg-gray-300 text-gray-800 hover:text-white hover:bg-gray-800"
                            }`}
                    >
                        <button onClick={() => onPageChange(number)}>{number}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Contributions;
