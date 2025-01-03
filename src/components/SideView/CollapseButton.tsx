import { useSideView } from "./SideView";

export function CollapseButton() {
  const { collapsed } = useSideView();

  const PlusIcon = (
    <>
      <path
        d='M1.482-9.191H13.406v2.54H1.482Z'
        transform='translate(238.401 186.852)'
      />
      <path
        d='M1.482-9.191H13.406v2.54H1.482Z'
        transform='translate(237.925 171.487) rotate(90)'
      />
    </>
  );

  const MinusIcon = (
    <>
      <path
        d='M1.482-9.191H13.406v2.54H1.482Z'
        transform='translate(238.401 186.852)'
      />
    </>
  );

  return (
    <button
      onClick={() => collapsed.set(!collapsed.value)}
      id='sidebar-collapse-button'
      className='mt-11 shrink-0 self-end group-[[data-collapsed=true]]/side-view:mr-4'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='29'
        height='27'
        viewBox='0 0 29 27'
      >
        <g transform='translate(-231 -165)'>
          {collapsed.value ? PlusIcon : MinusIcon}
        </g>
      </svg>
    </button>
  );
}
