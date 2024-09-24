import Layout from '../search-results/layout';
import SearchResultsContent from '../_components/SearchResultsContent';
import BackNavigation from '../_components/BackNavigation';

export default function Page() {
  return (
    <Layout>
      <BackNavigation />
      <SearchResultsContent />
    </Layout>
  );
}
