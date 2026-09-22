import MembersOnly from '@/components/membership/MembersOnly';

/** Details and booking are for members; the search results stay open to all. */
export default function Layout({ children }) {
  return <MembersOnly>{children}</MembersOnly>;
}
