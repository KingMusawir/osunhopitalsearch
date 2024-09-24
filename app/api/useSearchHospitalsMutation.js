import { useMutation, useQueryClient } from '@tanstack/react-query';
import { searchHospitals as searchHospitalsApi } from '../_lib/data-service';
import { useRouter } from 'next/navigation';

export function useSearchHospitalsMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: searchHospitalsApi,
    onSuccess: (data, variables) => {
      // Store the fetched data in the query cache
      queryClient.setQueryData(['hospitals'], data); // No need to include variables here if you're not using them in the URL

      // Navigate to the search results page without parameters
      router.push('/search-results');
    },
  });
}

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { searchHospitals as searchHospitalsApi } from '../_lib/data-service';
// import { useRouter } from 'next/navigation';

// export function useSearchHospitalsMutation() {
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   return useMutation({
//     mutationFn: searchHospitalsApi,
//     onSuccess: (data, variables) => {
//       queryClient.setQueryData(['hospitals', variables], data);

//       // Construct the URL path based on the provided format
//       let path = '/search-results';

//       if (variables.lat && variables.lng) {
//         path += `/${variables.radius || '10'}/center/${variables.lat},${
//           variables.lng
//         }/unit/km`;
//       } else if (variables.lga) {
//         path += `?lga=${variables.lga}`;
//       }

//       router.push(path);
//     },
//   });
// }
