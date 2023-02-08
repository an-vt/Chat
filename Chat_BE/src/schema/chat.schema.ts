import { array, object, string } from "yup";

export const createChatSchema = object({
  body: object().shape({
    memberIds: array()
      .typeError("MemberIds is required")
      .required("MemberIds is required"),
    type: string()
      .required("Field type is required")
      .test(
        "content",
        "Must be GROUP or SELF",
        (val) => val === "GROUP" || val === "SELF"
      ),
    groupName: string().when("type", {
      is: "GROUP",
      then: string()
        .strict()
        .typeError("groupName must be a string")
        .required("groupName is required"),
      otherwise: string().notRequired(),
    }),
  }),
});

export const addMemberSchema = object({
  body: object().shape({
    memberId: string()
      .strict()
      .required("memberId is required")
      .typeError("memberId must be string"),
    roomId: string()
      .strict()
      .required("roomId is required")
      .typeError("roomId must be string"),
  }),
});

export const getRoomByUserSchema = object({
  params: object().shape({
    userId: string().required("userId is required"),
  }),
});
