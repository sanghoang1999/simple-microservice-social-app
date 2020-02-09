let db = {
  users: [
    {
      userId,
      email,
      handle,
      createAt,
      bio,
      website,
      location
    }
  ],
  screams: [
    {
      userHandle: "$handle",
      body,
      createAt,
      likeCount,
      commentCount
    }
  ]
};
