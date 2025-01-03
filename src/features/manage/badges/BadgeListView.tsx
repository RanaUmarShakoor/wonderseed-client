import { resolveUploadUrl, useGetBadges } from "apiconn";
import { badgeToString } from "badge-types";
import { ExpandedSpinner } from "components/Spinner";
import { Link } from "react-router-dom";

function BadgeTable({ badges }: { badges: any[] }) {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-green-1 text-xs uppercase text-white'>
          <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
            <th className='w-0'>Badge</th>
            <th>Name</th>
            <th>Type</th>
            <th>Streak Required</th>
            <th>
              <span className='sr-only'></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {badges.map((badge, index) => (
            <tr
              key={index}
              className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
            >
              <td>
                {/* <img src='/badge-1.png' className='max-w-[8rem]' /> */}
                <img
                  src={resolveUploadUrl(badge.image?.filePath ?? 'not-found.jpg')}
                  className='max-w-[8rem]'
                />
              </td>
              <td>{badge.name}</td>
              <td>{badgeToString(badge.btype as any)}</td>
              <td>{badge.streak_days ?? "N/A"}</td>
              <td className='whitespace-nowrap'>
                <div className='flex items-center justify-end gap-x-3'>
                  <Link
                    to={`../edit/${badge.id}`}
                    className='text-blue-600 hover:underline'
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BadgeListView() {
  let { data: badges, isLoading } = useGetBadges({
    keepPreviousData: true,
    initialData: []
  });

  if (isLoading) return <ExpandedSpinner />;

  return (
    <section className='mt-8'>
      <header className='flex items-center'>
        <h4 className='mb-8 text-4xl font-bold'>Badges</h4>
        <Link to='../new' className='w-button ml-auto'>
          Add Badge
        </Link>
      </header>
      <BadgeTable badges={badges} />
    </section>
  );
}
