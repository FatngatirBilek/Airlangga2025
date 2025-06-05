import EditTopicForm from "@/components/EditSuaraForm";

interface Params {
  id: string;
}

const getSuaraById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/suara/${id}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch suara");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return { suara: null }; // Return null if there's an error
  }
};

export default async function EditSuara({ params }: { params: Params }) {
  const { id } = params;
  const { suara } = await getSuaraById(id);

  if (!suara) {
    return <div>Suara not found.</div>;
  }

  const { nama, nomor, count } = suara;

  return <EditTopicForm id={id} nama={nama} nomor={nomor} count={count} />;
}
