import fetch from 'node-fetch';

const getNewTag = tag => {
  const [major, minor, patch] = tag.split('.');
  if (process.env.VERSION_CHANGE_TYPE === 'major') {
    return `${Number(major) + 1}.0.0`;
  } else if (process.env.VERSION_CHANGE_TYPE === 'minor') {
    return `${major}.${Number(minor) + 1}.0`;
  } else if (process.env.VERSION_CHANGE_TYPE === 'patch') {
    return `${major}.${minor}.${Number(patch) + 1}`;
  }

  return tag;
};

const createTag = async () => {
  const response = await fetch(
    `${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_REPOSITORY}/tags`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${process.env.GITHUB_AUTH_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  const mostRecentTag = data[0].name;
  const [tagVersion, tagVersionNumber] = mostRecentTag.split('-');
  const cleanTag = tagVersion.replace('v', '');
  const newTag = getNewTag(cleanTag);
  const updatedTagVersionNumber =
    cleanTag === newTag ? Number(tagVersionNumber) + 1 : 1;
  const tagName = `v${newTag}-${updatedTagVersionNumber}`;

  await fetch(
    `${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_REPOSITORY}/releases`,
    {
      body: JSON.stringify({
        owner: 'cardstack',
        repo: 'cardwallet',
        tag_name: tagName,
        target_commitish: process.env.GITHUB_REF,
        name: `Release ${tagName}`,
        body: `Released at ${new Date(Date.now()).toISOString()}`,
      }),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${process.env.GITHUB_AUTH_TOKEN}`,
      },
    }
  );
};

createTag();
