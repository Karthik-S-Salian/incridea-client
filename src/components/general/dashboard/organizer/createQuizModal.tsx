import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import Button from "~/components/button";
import { TextInput, DateTimeInput } from "~/components/input";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { CreateQuizDocument } from "~/generated/generated";

const CreateQuizModal: FC<{
  eventId: string;
  roundNo: number;
}> = ({ eventId, roundNo }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [createQuiz, { loading }] = useMutation(CreateQuizDocument);

  const handleCreateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !startTime || !endTime) {
      await createToast(
        Promise.reject(new Error("All fields are required")),
        "Validation failed",
      );
      return;
    }

    const promise = createQuiz({
      variables: {
        quizDescription: description,
        endTime,
        eventId,
        quizTitle: name,
        startTime,
        roundId: String(roundNo),
        password,
      },
      refetchQueries: ["EventByOrganizer"],
      awaitRefetchQueries: true,
    })
      .then((res) => {
        if (res.data?.createQuiz.__typename === "MutationCreateQuizSuccess") {
          setName("");
          setDescription("");
          handleCloseModal();
        } else {
          throw new Error(
            res.data?.createQuiz.message ?? "Error creating quiz",
          );
        }
      })
      .catch(async (err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        await createToast(Promise.reject(error), "Failed to create quiz");
      });

    await createToast(promise, `Adding quiz...`);
  };

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <div className="mt-5">
      <Button
        onClick={() => {
          setShowModal(true);
        }}
      >
        Create Quiz
      </Button>
      <Modal
        title={`Create Quiz`}
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
      >
        <div
          className={`p-5 ${
            loading && "pointer-events-none cursor-not-allowed opacity-50"
          }`}
        >
          <form className="flex flex-col gap-5" onSubmit={handleCreateQuiz}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Quiz Name</label>
              <TextInput
                name="name"
                placeholder="Enter quiz name"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="description">Quiz Description (Optional)</label>
              <TextInput
                name="description"
                placeholder="Enter quiz description"
                value={description}
                disabled={loading}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label htmlFor="password">Quiz Password</label>
              <TextInput
                name="password"
                placeholder="Enter quiz password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="startTime">Start Time</label>
              <DateTimeInput
                name="startTime"
                placeholder="Start Time"
                value={startTime}
                disabled={loading}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <label htmlFor="endTime">End Time</label>
              <DateTimeInput
                name="endTime"
                placeholder="End Time"
                value={endTime}
                disabled={loading}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button className="rounded-lg" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner intent={"white"} size={"small"} />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateQuizModal;
