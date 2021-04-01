import fetch from 'node-fetch';
import { v4 } from 'uuid';

const getNewTag = tag => {
  const [major, minor, patch] = tag.split('.');
  if (process.env.BUMP_TYPE === 'major') {
    return `${Number(major) + 1}.${minor}.${patch}`;
  } else if (process.env.BUMP_TYPE === 'minor') {
    return `${major}.${Number(minor) + 1}.${patch}`;
  } else if (process.env.BUMP_TYPE === 'patch') {
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
  const [tagVersionOnly] = mostRecentTag.split('-');
  const cleanTag = tagVersionOnly.replace('v', '');
  const newTag = getNewTag(cleanTag);
  const tagName = `v${newTag}-${v4().substring(0, 6)}`;

  console.log('tagName', tagName);
};

createTag();
